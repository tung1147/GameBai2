/*
 * ListViewWithAdaptor.h
 *
 *  Created on: May 16, 2016
 *      Author: Quyet Nguyen
 */

#ifndef COMMON_LISTVIEWWITHADAPTOR_H_
#define COMMON_LISTVIEWWITHADAPTOR_H_

#include "cocos2d.h"
#include "ui/CocosGUI.h"
USING_NS_CC;

namespace quyetnd{

class ListViewWithAdaptor : public cocos2d::ui::ScrollView{
protected:
	float _padding;
	float _marginLeft;
	float _marginRight;
	float _marginTop;
	float _marginBottom;

	int _lastIndex;

	std::vector<Node*> _allItems;
	Size _itemSize;

	std::function<int()> _sizeCallback;
	std::function<void(int, Node*)> _itemAdaptor;
	std::function<Node*()> _createItemCallback;

	virtual void forceRefreshView();
	virtual int getItemSize();

	
	virtual void initItem();
public:
	ListViewWithAdaptor();
	virtual ~ListViewWithAdaptor();

	virtual void initWithSize(const cocos2d::Size& size);

	virtual void visit(Renderer *renderer, const Mat4 &parentTransform, uint32_t parentFlags);

	virtual void setSizeCallback(const std::function<int()>& sizeCallback);
	virtual void setCreateItemCallback(const std::function<Node*()>& callback);

	virtual void setItemAdaptor(const std::function<void(int, Node*)>& adaptor);

	virtual void setPadding(float padding);
	virtual void setMargin(float top, float bot, float left, float right);

	virtual void refreshView();

	static ListViewWithAdaptor* create(const cocos2d::Size& size);
};

}
#endif /* COMMON_LISTVIEWWITHADAPTOR_H_ */
