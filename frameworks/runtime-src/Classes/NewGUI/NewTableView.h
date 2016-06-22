/*
 * NewTableView.h
 *
 *  Created on: Nov 14, 2015
 *      Author: QuyetNguyen
 */

#ifndef COMMON_NEWTABLEVIEW_H_
#define COMMON_NEWTABLEVIEW_H_

#include <string>
#include <stdint.h>
#include "cocos2d.h"
USING_NS_CC;
#include "ui/CocosGUI.h"

namespace quyetnd{
enum TableViewItemAction{
	ItemStartAnimation = 1,
	ItemFinishedAnimation
};
class TableView : public ui::ScrollView{
public:  
    typedef std::function<void(int action, Node* item)> ItemAnimationHandler;  
protected:
	int columnSize;
	int rowSize;

	float marginTop;
	float marginBottom;
	float marginLeft;
	float marginRight;
	float padding;
	bool _isUpdateView;
	bool _updateEffect;
	bool _runningEffect;
    
    ItemAnimationHandler _handler;
	std::vector<Node*> _items;
	
	void refreshViewVertical();
	void refreshViewHorizontal();	

	bool getItemsRow(std::vector<Node*> &items, int index);
	bool getItemsColumn(std::vector<Node*> &items, int index);

	float effectMoveSpeed;
	float effectTimeDelayPerColumn;
	float effectTimeDelayPerRow;

	void updateRunMoveEffect();
    int itemsEffect;
    void runMoveEffectFinished();
    
    void onItemStartAnimation(Node* item);
    void onItemFinishedAnimation(Node* item);
public:
	
public:
	TableView();
	virtual ~TableView();
	void initWithSize(const Size& size, int columnSize);

	virtual void setDirection(Direction dir);
    
    void setAnimationHandler(const ItemAnimationHandler& handler);	
	void runMoveEffect(float moveSpeed, float delayPerColumn, float delayPerRow);

	void setPadding(float padding);
	void setMargin(float top, float bot, float left, float right);
	float getMarginTop();
	float getMarginBottom();
	float getMarginLeft();
	float getMarginRight();

	virtual void visit(Renderer *renderer, const Mat4 &parentTransform, uint32_t parentFlags);

	Node* getItem(int index);
	int size();

	virtual void removeAllItems();
	virtual void removeItem(Node* item);
	virtual void removeItem(int index);
	virtual void pushItem(Node* item);
	virtual void insertItem(Node* item, int index);

	void refreshView();
	void forceRefreshView();

	virtual void removeAllChildren();
	virtual void removeAllChildrenWithCleanup(bool cleanup);
	virtual void removeChild(Node* child, bool cleaup = true);

	virtual void jumpToBottom();
	virtual void jumpToTop();
	virtual void jumpToLeft();
	virtual void jumpToRight();

	static TableView* create(const Size& size, int columnOrRow);
};

}
#endif /* COMMON_NEWTABLEVIEW_H_ */
